import { FormEvent, useState, useEffect } from "react";

import { useForm } from '@inertiajs/react'
import { store } from '@/actions/App/Http/Controllers/LeadController'

type Props = {
  className?: string;
};
const OptInForm = ({ className = "" }: Props) => {

  const { setError, setData, post, data, processing, errors, submit } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    event_id: 2468
  })
  
  const [isOptInChecked, setIsOptInChecked] = useState(false);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { method, url } = store();
    submit(method, url, {
      onSuccess: () => {
        console.log('success')
      },
      onError: () => {
        console.log('error')
      }
    })
  };

  return (
    <section className={className}>
      <h2 className="text-base sm:text-lg mb-6 font-bold">
        Build live and on-demand video into your app.
        <br />
        Get a $100 credit, on us.
      </h2>
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
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
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
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
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
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
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
              disabled={processing}
            />
            <label htmlFor="opt-in">
              Yes, it&apos;s cool if Mux follows up with me by email with that
              $100 credit
            </label>
          </div>
          <button
            disabled={!isOptInChecked}
            className="px-8 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 transition"
            type="submit"
          >
            {processing ? "Submitting..." : "Submit"}
          </button>
        </form>
    </section>
  );
};
export default OptInForm;
