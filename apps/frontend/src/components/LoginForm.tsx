import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { string, minLength } from "valibot";
import { useLoginMutation } from "../api/auth.queries";
import { useNavigate } from "@tanstack/react-router";
import { Container, Stack } from "@panda/jsx";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import * as Card from "./ui/card";
import { FormLabel } from "./ui/form-label";
import { Button } from "./ui/button";

export const LoginForm = () => {
  const { mutate: loginMutation } = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      loginMutation(values.value, {
        onSuccess: () => {
          navigate({
            to: "/",
          });
        },
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <Container maxW="md" py="6">
          <Card.Root boxShadow="xs">
            <Card.Header>
              <Card.Title>Sign In</Card.Title>
            </Card.Header>
            <Card.Body>
              <Stack gap="4">
                <Stack gap="1.5">
                  <form.Field
                    name="username"
                    validatorAdapter={valibotValidator}
                    validators={{
                      onChange: string([minLength(1, "Username is required")]),
                    }}
                    children={(field) => (
                      <>
                        <FormLabel htmlFor={field.name}>Username</FormLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Username"
                          border={
                            field.state.meta.touchedErrors.length > 0
                              ? "1px solid red"
                              : ""
                          }
                        />
                        <Text color="red" fontSize="sm">
                          {field.state.meta.touchedErrors}
                        </Text>
                      </>
                    )}
                  />
                </Stack>
                <Stack gap="1.5">
                  <form.Field
                    name="password"
                    validatorAdapter={valibotValidator}
                    validators={{
                      onChange: string([minLength(1, "Password is required")]),
                    }}
                    children={(field) => (
                      <>
                        <FormLabel htmlFor={field.name}>Password</FormLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          placeholder="Password"
                          border={
                            field.state.meta.touchedErrors.length > 0
                              ? "1px solid red"
                              : ""
                          }
                        />
                        <Text color="red" fontSize="sm">
                          {field.state.meta.touchedErrors}
                        </Text>
                      </>
                    )}
                  />
                </Stack>
              </Stack>
            </Card.Body>
            <Card.Footer>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button width="full" type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Submit"}
                  </Button>
                )}
              />
            </Card.Footer>
          </Card.Root>
        </Container>
      </form>
    </div>
  );
};
