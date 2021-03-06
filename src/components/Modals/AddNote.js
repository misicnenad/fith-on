import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, styled } from "@mui/material";
import * as yup from "yup";
import Button from "../Button";
import Input from "../Input";

const schema = yup.object().shape({
  title: yup.string().required("Required"),
  text: yup.string(),
});

export default function AddNote({ onClose, onSubmit }) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputContainer>
        <Input
          label="Title*"
          registerReturn={register("title")}
          error={errors?.title?.message}
          autoFocus
        />
        <Input
          label="Text"
          registerReturn={register("text")}
          error={errors?.text?.message}
          multiline
          maxRows={3}
        />
      </InputContainer>
      <ButtonContainer>
        <Button onClick={onClose} color="secondary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button color="primary" disabled={isSubmitting} submit>
          Submit
        </Button>
      </ButtonContainer>
    </Form>
  );
}

const Form = styled("form")`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  width: 100%;
  gap: 15px;
  margin-top: 40px;
  justify-content: center;
`;

const InputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 80%;
`;
