import { useCallback, useMemo, useState } from "react";
import { Box, styled, Checkbox, FormControlLabel } from "@mui/material";
import ExerciseRow from "./ExerciseRow";
import { EXERCISES } from "../constants";

const repSchemas = {
  1: "5/5/5",
  2: "3/3/3",
  3: "5/3/1",
};

const percentagesPerWeek = {
  1: [0.65, 0.75, 0.85],
  2: [0.7, 0.8, 0.9],
  3: [0.75, 0.85, 0.95],
};

export default function WeekRow({ onUpdate, week, blockId }) {
  const [showNotes, setShowNotes] = useState(false);

  const handleExerciseUpdate = useCallback(
    (updatedExercise) => {
      const updatedWeek = { ...week };
      updatedWeek.exercises = updatedWeek.exercises.filter(
        (e) => e.name !== updatedExercise.name
      );
      updatedWeek.exercises.push(updatedExercise);
      onUpdate(updatedWeek);
    },
    [week, onUpdate]
  );

  const exerciseRows = useMemo(
    () =>
      EXERCISES.map((exName) => week.exercises.find((x) => x.name === exName))
        .filter((exercise) => (exercise?.trainingMax || 0) > 0)
        .map((exercise) => {
          const weights = getWeights(exercise.trainingMax, week.number);

          return (
            <ExerciseRow
              key={`${blockId}${week.number}${exercise.name}`}
              weights={weights}
              onUpdate={handleExerciseUpdate}
              exercise={exercise}
              showNotes={showNotes}
            />
          );
        }),
    [showNotes, week, blockId, handleExerciseUpdate]
  );

  const [first, second, third] = useMemo(
    () => getPercentages(week.number),
    [week]
  );

  return (
    <Container>
      <WeekHeader>
        <span>
          Week {week.number} ({repSchemas[week.number]})
        </span>
        <FormControlLabel
          control={
            <Checkbox
              checked={showNotes}
              onChange={(e) => setShowNotes(e.target.checked)}
            />
          }
          label="Show notes"
          labelPlacement="start"
        />
      </WeekHeader>
      <Table>
        <thead>
          <tr>
            <HeaderNameCell>Name</HeaderNameCell>
            <HeaderCell>TM</HeaderCell>
            <HeaderCell>{fractionToPercentage(first)}</HeaderCell>
            <HeaderCell>{fractionToPercentage(second)}</HeaderCell>
            <HeaderCell>{fractionToPercentage(third)}</HeaderCell>
            <HeaderCell>R+</HeaderCell>
          </tr>
        </thead>
        <tbody>{exerciseRows}</tbody>
      </Table>
    </Container>
  );
}

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  min-height: 220px;
`;

const WeekHeader = styled("h4")`
  margin-block: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Table = styled("table")`
  border-collapse: collapse;
  font-size: 0.9rem;
  text-align: center;
`;

const HeaderCell = styled("td")`
  font-weight: bold;
`;

const HeaderNameCell = styled(HeaderCell)`
  text-align: left;
`;

const fractionToPercentage = (fraction) => `${fraction * 100}%`;

const getWeights = (trainingMax, weekNumber) => {
  const weights = percentagesPerWeek[weekNumber].map((percentage) =>
    calculate(trainingMax, percentage)
  );

  return weights;
};

const calculate = (weight, percent) => {
  const exactWeight = weight * percent;
  const mod = exactWeight % 2.5;
  return exactWeight - mod;
};

const getPercentages = (weekNumber) => percentagesPerWeek[weekNumber];
