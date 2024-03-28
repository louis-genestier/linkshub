import { useForm } from "@tanstack/react-form";
import { useCreateBookmark } from "../api/bookmarks.queries";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { string, url } from "valibot";

export const CreateBookmarkForm = () => {
  const { mutate: createBookmarkMutation } = useCreateBookmark();

  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
    },
    onSubmit: ({ value: bookmark }) => {
      createBookmarkMutation(bookmark);
    },
  });
  return (
    <>
      <h3>Create a new bookmark</h3>
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
              name="title"
              children={(field) => (
                <>
                  <label htmlFor={field.name}>Title</label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
            <form.Field
              name="url"
              validatorAdapter={valibotValidator}
              validators={{
                onChange: string([url("This should be an url")]),
              }}
              children={(field) => (
                <>
                  <label htmlFor={field.name}>url link</label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="url"
                  />
                  <p>{field.state.meta.touchedErrors}</p>
                </>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "..." : "Submit"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </>
  );
};
