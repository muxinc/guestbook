import { FormEvent, useId } from "react";

import Dialog from "components/Dialog";

export type Form = {
  firstName: string;
  lastName: string;
  email: string;
};
export type SignupDismissFn = (form?: Form) => void;

type Props = {
  isDialogOpen: boolean;
  onDismiss: SignupDismissFn;
  disabled?: boolean;
};

const SettingsDialog = ({
  isDialogOpen,
  onDismiss,
  disabled = false,
}: Props) => {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");

    if (
      typeof firstName === "string" &&
      typeof lastName === "string" &&
      typeof email === "string"
    ) {
      onDismiss({
        firstName,
        lastName,
        email,
      });
    }
  };
  const onNoThanks = async () => {
    onDismiss();
  };

  return (
    <Dialog
      isDialogOpen={isDialogOpen}
      onDismiss={onNoThanks}
      className="text-lg leading-12"
      label="Sign up for Mux Updates!"
    >
      <p className="mb-4 text-2xl font-header text-center">One more thing...</p>
      <h3 className="text-3xl font-bold text-center mb-8">
        Sign Up for Mux Updates!
        <br />
        Win this 4K monitor!
      </h3>
      <p>Fill out this form and you&apos;ll</p>
      <ul className="list-disc ml-8 mb-4">
        <li>Be entered to win this 4K USB-C Monitor</li>
        <li>Receive a link to your awesome guestbook clip</li>
        <li>
          Get hot takes from our killer team about ways Mux can help you{" "}
          <em>👏&nbsp;win 👏&nbsp;at 👏&nbsp;video</em>
        </li>
      </ul>
      <form onSubmit={onFormSubmit}>
        <div className="mb-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block mb-1" htmlFor={firstNameId}>
              First Name:
            </label>
            <input
              name="firstName"
              id={firstNameId}
              type="text"
              autoComplete="given-name"
              className="border disabled:border-gray-400 rounded-sm bg-transparent p-2 w-full"
              required
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor={lastNameId}>
              Last Name:
            </label>
            <input
              name="lastName"
              id={lastNameId}
              type="text"
              autoComplete="family-name"
              className="border disabled:border-gray-400 rounded-sm bg-transparent p-2 w-full"
              required
              disabled={disabled}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor={emailId}>
            Email:
          </label>
          <input
            name="email"
            id={emailId}
            type="email"
            autoComplete="email"
            className="border disabled:border-gray-400 rounded-sm bg-transparent p-2 w-full"
            required
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          className="rounded-sm w-full transition bg-pink-400 hover:bg-pink-300 disabled:bg-gray-400 disabled:text-gray-700 text-gray-900 p-2 mb-2"
          disabled={disabled}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onNoThanks();
          }}
          className="rounded-sm w-full transition bg-gray-300 hover:bg-gray-200 disabled:text-gray-600 text-gray-900 p-2"
          disabled={disabled}
        >
          Nah, No Thanks
        </button>
      </form>
    </Dialog>
  );
};

export default SettingsDialog;
