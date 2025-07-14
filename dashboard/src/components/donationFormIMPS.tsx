import React, { useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import notify from "./notify";
import { addDonationApiIMPS } from "../dataFetching/donationApi/donation.api";
import { AddDonationValidationSchemaIMPS } from "../validationchema/validation";

const AddDonationForm: React.FC = () => {
  const initialValues = {
    purpose: "",
    amount: 0,
    paymentMode: "",
    paymentMethod: "",
    ddNumber: "",
    chequeNumber: "",
    bank: "",

    donationDate: new Date().toISOString().split("T")[0],
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm, setFieldError }: any
  ) => {
    // checking if the payment method is correct
    let finalPaymentMethod = values.paymentMode; // Start with the base payment mode

    if (values.paymentMode === "DD") {
      if (values.ddNumber) {
        finalPaymentMethod = `DD-${values.ddNumber}`;
      } else {
        setFieldError("ddNumber", "DD Number is required.");
        return;
      }
    } else if (values.paymentMode === "CHEQUE") {
      if (values.chequeNumber) {
        finalPaymentMethod = `CHEQUE-${values.chequeNumber}-${values.bank}`;
      } else {
        setFieldError("chequeNumber", "Cheque Number is required.");
        return;
      }
    } else if (values.paymentMode === "UPI") {
      if (values.bank) {
        finalPaymentMethod = `UPI-${values.bank}`;
      } else {
        setFieldError("bank", "Please select the bank, it is required.");
        return;
      }
    }

    const AddedData = {
      amount: values.amount,
      purpose: values.purpose, // this is description
      paymentMethod: finalPaymentMethod,
      donationDate: values.donationDate,
    };

    try {
      const CustomApiResponse = await notify(
        "",
        false,
        addDonationApiIMPS(AddedData)
      );
      const apiData = CustomApiResponse?.apiResponse;

      if (apiData.data) {
        notify(apiData.message, apiData.success);
        resetForm();
      }
    } catch (error: any) {
      notify(error.apiResponse.data.message, false);
    } finally {
      setSubmitting(false);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="bg-white p-10 py-16  rounded-lg  w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={AddDonationValidationSchemaIMPS}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="grid lg:grid-cols-3 grid-cols-2 gap-8 justify-items-center">
            {/* Left Side Fields */}

            {/* first column */}
            <div className="space-y-6">
              <div>
                <label>Amount*</label>
                <Field
                  type="text"
                  name="amount"
                  id="amount"
                  className="w-full"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label>Description*</label>
                <Field
                  as="textarea"
                  name="purpose"
                  id="purpose"
                  className="w-full"
                  rows={5} // Optional: Specifies the number of rows for better UI
                />
                <ErrorMessage
                  name="purpose"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-semibold">Payment Method *</label>
                  <div className="flex gap-4 mt-2">
                    {["CASH", "CHEQUE", "UPI", "DD"].map((method) => (
                      <label key={method} className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="paymentMode"
                          value={method}
                          className="w-4 h-4"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="paymentMode"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Conditional DD Number Field */}
                <Field name="paymentMode">
                  {({ field }: any) =>
                    field.value == "DD" ? (
                      <div>
                        <label>DD Number</label>
                        <Field
                          type="text"
                          name="ddNumber"
                          id="ddNumber"
                          className="w-full"
                        />
                        <ErrorMessage
                          name="ddNumber"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    ) : null
                  }
                </Field>
                {/* Conditional cheque Number Field */}
                <Field name="paymentMode">
                  {({ field }: any) =>
                    field.value == "CHEQUE" ? (
                      <div>
                        <label>Cheque Number</label>
                        <Field
                          type="text"
                          name="chequeNumber"
                          id="ddNumber"
                          className="w-full"
                        />
                        <ErrorMessage
                          name="chequeNumber"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    ) : null
                  }
                </Field>
                {/* Conditional Bank Field */}
                <Field name="paymentMode">
                  {({ field }: any) =>
                    field.value === "UPI" || field.value === "CHEQUE" ? (
                      <div className="flex flex-col space-y-1">
                        <label>Select bank</label>
                        <Field as="select" name="bank" id="countrySelect">
                          <option value="">Select a bank</option>
                          {[
                            "Punjab National Bank",
                            "Canara Bank",
                            "State Bank of india",
                          ].map((bank) => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="bank"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    ) : null
                  }
                </Field>
              </div>
            </div>

            {/* third column */}
            <div className="space-y-6">
              <div>
                <label>Donation Date *</label>
                <Field
                  type="date"
                  name="donationDate"
                  id="donationDate"
                  className="w-full"
                />
                <ErrorMessage
                  name="donationDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="mt-20 normal-button-bg-secondary">
            Add Donation
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddDonationForm;
