import { FormEvent, useState, useEffect } from "react";

enum FormState {
  INITIALIZING,
  IDLE,
  SUBMITTING,
  SUCCESS,
  FAILURE,
}
type Props = {
  className?: string;
};
const OptInForm = ({ className = "" }: Props) => {
  const [isOptInChecked, setIsOptInChecked] = useState(false);
  const [formState, setFormState] = useState<FormState>(
    () => FormState.INITIALIZING
  );
  useEffect(() => {
    // when the page loads, enable the form
    setFormState(FormState.IDLE);
  }, []);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    setFormState(FormState.SUBMITTING);
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const formDataJson: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") formDataJson[key] = value;
    });

    fetch("/api/subscribe", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataJson),
    })
      .then((response) => {
        if (response.status < 400) {
          setFormState(FormState.SUCCESS);
        } else {
          setFormState(FormState.FAILURE);
          console.error(response);
        }
      })
      .catch((error) => {
        setFormState(FormState.FAILURE);
        console.error(error);
      });
  };
  return (
    <section className={className}>
      <h2 className="text-base sm:text-lg mb-6 font-bold">
        Build live and on-demand video into your app.
        <br />
        Get a $100 credit, on us.
      </h2>
      {formState === FormState.SUCCESS ? (
        <p>Success! We can&apos;t wait to see what you make with Mux!</p>
      ) : formState === FormState.FAILURE ? (
        <p>Something went wrong. Please try again?</p>
      ) : (
        <form onSubmit={onFormSubmit}>
          <div className="grid sm:grid-cols-2 gap-x-2 gap-y-4 mb-6">
            <div>
              <label className="block mb-1" htmlFor="opt-in-first-name">
                First Name
              </label>
              <input
                className="w-full border rounded p-2"
                id="opt-in-first-name"
                name="firstName"
                type="text"
                required
                placeholder="Ted"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="opt-in-last-name">
                Last Name
              </label>
              <input
                className="w-full border rounded p-2"
                id="opt-in-last-name"
                name="lastName"
                type="text"
                required
                placeholder="Lasso"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-1" htmlFor="opt-in-email">
                Email
              </label>
              <input
                className="w-full border rounded p-2"
                id="opt-in-email"
                name="email"
                type="email"
                required
                placeholder="biscuits@mux.com"
              />
            </div>
          </div>
          <div className="sm:col-span-2 flex items-center mb-6">
            <input
              className="mr-4"
              id="opt-in"
              name="consent"
              type="checkbox"
              checked={isOptInChecked}
              onChange={(e) => setIsOptInChecked(e.target.checked)}
              required
            />
            <label htmlFor="opt-in">
              Yes, it&apos;s cool if Mux follows up with me by email with that
              $100 credit
            </label>
          </div>
          <button
            disabled={formState !== FormState.IDLE || !isOptInChecked}
            className="px-8 py-2 rounded text-white bg-pink-500 hover:bg-pink-400 disabled:bg-pink-200 transition"
            type="submit"
          >
            {formState === FormState.SUBMITTING ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </section>
  );
};
export default OptInForm;
