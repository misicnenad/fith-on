import { useCallback, useContext } from "react";
import { ModalContext } from "../../../providers";
import { AddBlock } from "../../Modals";
import { EXERCISES } from "../../../constants";

export default function useAddBlockModal(add) {
  const { openModal, closeModal } = useContext(ModalContext);

  const open = useCallback(
    (suggestedValues) => {
      const onSubmit = (blockData) => {
        const section = createBlock(blockData);
        add(section);
        closeModal();
      };
      const modalContent = (
        <AddBlock
          onSubmit={onSubmit}
          onClose={closeModal}
          initialValues={suggestedValues}
        />
      );
      openModal(modalContent);
    },
    [closeModal, openModal, add]
  );

  return {
    open,
    close: closeModal,
  };
}

const createBlock = (blockData) => {
  const weeks = [];
  const numberOfWeeks = 3;

  for (let i = 1; i <= numberOfWeeks; i++) {
    weeks.push({
      number: i,
      exercises: EXERCISES.map((exName) =>
        createExercise(exName, blockData[`${exName}Max`])
      ),
    });
  }

  return {
    type: "block",
    number: blockData.blockNumber,
    weeks: weeks,
  };
};

const createExercise = (exerciseName, trainingMax) => ({
  name: exerciseName,
  trainingMax,
  amrapReps: 0,
});
