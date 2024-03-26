import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { string, minLength } from "valibot";
import { useLoginMutation } from "../api/auth.queries";
import { useNavigate } from "@tanstack/react-router";

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
        <div>
          <form.Field
            name="username"
            validatorAdapter={valibotValidator}
            validators={{
              onChange: string([minLength(1, "Username is required")]),
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name}>Username</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.state.meta.touchedErrors}</p>
              </>
            )}
          />
          <form.Field
            name="password"
            validatorAdapter={valibotValidator}
            validators={{
              onChange: string([minLength(1, "Password is required")]),
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name}>Password</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                />
                <p>{field.state.meta.touchedErrors}</p>
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
      </form>
    </div>
  );
};
