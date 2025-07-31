import React, { useState } from "react";
import DashboardLayout from "./layout/ThemeLyout";
import { useFormik } from "formik";
import * as Yup from "yup";

const initialData = [
    {
        id: 1,
        name: "John Brown",
        username: "johnbrown",
        email: "john@example.com",
        phone: "1234567890",
    },
    {
        id: 2,
        name: "Jim Green",
        username: "jimgreen",
        email: "jim@example.com",
        phone: "2345678901",
    },
    {
        id: 3,
        name: "Joe Black",
        username: "joeblack",
        email: "joe@example.com",
        phone: "3456789012",
    },
    // more data as needed
];

const PAGE_SIZE = 3;

// Validation schema for create
const validationSchemaCreate = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

// Validation schema for update (no password validation required)
const validationSchemaUpdate = Yup.object({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
});

const DynamicTable = () => {
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // Open modal for create or edit
    const openModal = (record = null) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
    };

    // Formik setup dynamically
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editingRecord?.name || "",
            username: editingRecord?.username || "",
            email: editingRecord?.email || "",
            phone: editingRecord?.phone || "",
            password: "",
            confirm_password: "",
        },
        validationSchema: editingRecord
            ? validationSchemaUpdate
            : validationSchemaCreate,
        onSubmit: (values) => {
            if (editingRecord) {
                // Update existing record
                setData((prev) =>
                    prev.map((item) =>
                        item.id === editingRecord.id
                            ? {
                                ...item,
                                name: values.name,
                                username: values.username,
                                email: values.email,
                                phone: values.phone,
                                // Only update password if provided
                                ...(values.password ? { password: values.password } : {}),
                            }
                            : item
                    )
                );
            } else {
                // Create new record
                const newRecord = {
                    id: Date.now(),
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                };
                setData((prev) => [newRecord, ...prev]);
                setCurrentPage(1);
            }
            closeModal();
        },
    });

    // Delete row
    const deleteRow = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        // Adjust page if needed
        if ((data.length - 1) <= (currentPage - 1) * PAGE_SIZE && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Pagination computation
    const pageCount = Math.ceil(data.length / PAGE_SIZE);
    const pagedData = data.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <DashboardLayout>
            <div className=" p-6 transition-colors duration-300">
                <div className=" mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Dynamic Table
                        </h1>
                        <button
                            onClick={() => openModal()}
                            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 focus:outline-none"
                        >
                            Create New
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                            <thead className="bg-gray-200 dark:bg-gray-700">
                                <tr>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                        Name
                                    </th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                        Username
                                    </th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                        Email
                                    </th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                        Phone
                                    </th>
                                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center text-gray-800 dark:text-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedData.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                                    >
                                        <td className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2">
                                            {row.name}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">
                                            {row.username}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">
                                            {row.email}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-100">
                                            {row.phone}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center space-x-2 text-gray-800 dark:text-gray-100">
                                            <button
                                                onClick={() => openModal(row)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 focus:outline-none"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteRow(row.id)}
                                                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 focus:outline-none"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {pagedData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center p-4 text-gray-500 dark:text-gray-400"
                                        >
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 space-x-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded border ${currentPage === 1
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                                }`}
                        >
                            Prev
                        </button>
                        {[...Array(pageCount)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
                            disabled={currentPage === pageCount}
                            className={`px-3 py-1 rounded border ${currentPage === pageCount
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                {editingRecord ? "Edit User" : "Create User"}
                            </h2>
                            <form onSubmit={formik.handleSubmit} noValidate>
                                {/* Name */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="name"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        className={`w-full p-2 rounded border ${formik.touched.name && formik.errors.name
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        // {...formik.getFieldProps("name")}
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                                    )}
                                </div>

                                {/* Username */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="username"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        className={`w-full p-2 rounded border ${formik.touched.username && formik.errors.username
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.username && formik.errors.username && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {formik.errors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={`w-full p-2 rounded border ${formik.touched.email && formik.errors.email
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="phone"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        className={`w-full p-2 rounded border ${formik.touched.phone && formik.errors.phone
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                                    )}
                                </div>

                                {/* Password */}
                                {!editingRecord && <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Password {editingRecord ? <span className="text-sm text-gray-500">{`(leave blank to keep unchanged)`}</span> : ""}
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        className={`w-full p-2 rounded border ${formik.touched.password && formik.errors.password
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                                    )}
                                </div>}

                                {/* Confirm Password */}
                                {!editingRecord && <div className="mb-4">
                                    <label
                                        htmlFor="confirm_password"
                                        className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
                                    >
                                        Confirm Password{" "}
                                        {editingRecord ? (
                                            <span className="text-sm text-gray-500">{`(leave blank to keep unchanged)`}</span>
                                        ) : null}
                                    </label>
                                    <input
                                        id="confirm_password"
                                        name="confirm_password"
                                        type="password"
                                        autoComplete="new-password"
                                        className={`w-full p-2 rounded border ${formik.touched.confirm_password && formik.errors.confirm_password
                                            ? "border-red-500 focus:outline-red-600"
                                            : "border-gray-300 focus:outline-indigo-600"
                                            } dark:bg-gray-700 dark:text-gray-100`}
                                        value={formik.values.confirm_password}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.confirm_password && formik.errors.confirm_password && (
                                        <p className="text-red-500 text-sm mt-1">{formik.errors.confirm_password}</p>
                                    )}
                                </div>}

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded bg-gray-400 text-gray-900 hover:bg-gray-500 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                                    >
                                        {editingRecord ? "Update" : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DynamicTable;
