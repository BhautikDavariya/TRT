import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CreateAccountPage() {
    const formik = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            username: Yup.string()
                .min(3, "Username must be at least 3 characters")
                .required("Username is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            phoneNumber: Yup.string()
                .matches(
                    /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10,15}$/,
                    "Phone number is not valid"
                )
                .required("Phone number is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: (values) => {
            // Replace with real submit logic here
            alert(JSON.stringify(values, null, 2));
        },
    });

    // helper function to generate form input fields with consistent styling
    const renderInput = (
        id,
        label,
        type = "text",
        autoComplete = "off",
        extraProps = {}
    ) => (
        <div>
            <label
                htmlFor={id}
                className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={id}
                    name={id}
                    type={type}
                    autoComplete={autoComplete}
                    required
                    className={`block w-full rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${formik.touched[id] && formik.errors[id]
                        ? "border-red-500 focus:outline-red-600"
                        : "border-gray-500 focus:outline-gray-600"
                        }`}
                    {...formik.getFieldProps(id)}
                    {...extraProps}
                />
                {formik.touched[id] && formik.errors[id] ? (
                    <p className="mt-1 text-sm text-red-600">{formik.errors[id]}</p>
                ) : null}
            </div>
        </div>
    );

    return (
        <>
            <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-xl w-7/12 mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Create an account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
                            {renderInput("name", "Full Name", "text", "name")}
                            {renderInput("username", "Username", "text", "username")}
                            {renderInput("email", "Email address", "email", "email")}
                            {renderInput("phoneNumber", "Phone Number", "tel", "tel")}
                            {renderInput("password", "Password", "password", "new-password")}
                            {renderInput(
                                "confirm_password",
                                "Confirm Password",
                                "password",
                                "new-password"
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                            Already registered?{" "}
                            <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
