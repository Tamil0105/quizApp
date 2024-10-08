// import React, { useEffect, useState } from 'react';
// import { saveAs } from 'file-saver';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// // Define types for the department analytics and student details
// interface TestResult {
//   testName: string;
//   pass: boolean;
//   timeTaken: number;
//   marks: number;
// }

// interface StudentDetails {
//   studentName: string;
//   department: string;
//   registrationNumber: string;
//   collegeName: string;
//   testsTaken: number;
//   testResults: TestResult[];
// }

// interface DepartmentAnalytics {
//   department: string;
//   totalStudents: number;
//   totalTestsTaken: number;
//   passedCount: number;
//   failedCount: number;
//   studentDetails: StudentDetails[];
// }

// interface Props {
//   department: string;
// }

// const AnalyticPage: React.FC<Props> = ({ department }) => {
//   const [analytics, setAnalytics] = useState<DepartmentAnalytics | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     axios.get(`https://quiz-server-sigma.vercel.app/responses/analytics/department/${department}`, { headers })
//       .then((response) => {
//         setAnalytics(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching analytics:', error);
//         setLoading(false);
//       });
//   }, [department]);

//   const exportAllAsCSV = () => {
//     if (!analytics) return;

//     const csvData = analytics.studentDetails.map((student) => {
//       return {
//         studentName: student.studentName,
//         department: student.department,
//         registrationNumber: student.registrationNumber,
//         collegeName: student.collegeName,
//         testsTaken: student.testsTaken,
//         passedCount: student.testResults.filter((res) => res.pass).length,
//         failedCount: student.testsTaken - student.testResults.filter((res) => res.pass).length,
//         testDetails: student.testResults.map((res) => `${res.testName}: ${res.pass ? 'Pass' : 'Fail'} (Marks: ${res.marks}, Time: ${res.timeTaken})`).join(', ')
//       };
//     });

//     const csvRows = [
//       ['Student Name', 'Department', 'Registration Number', 'College Name', 'Tests Taken', 'Passed', 'Failed', 'Test Details'],
//       ...csvData.map((row) => [
//         row.studentName,
//         row.department,
//         row.registrationNumber,
//         row.collegeName,
//         row.testsTaken,
//         row.passedCount,
//         row.failedCount,
//         row.testDetails
//       ])
//     ];

//     const csvContent = csvRows.map((row) => row.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     saveAs(blob, 'department-analytics.csv');
//   };

//   const exportAllAsXLSX = () => {
//     if (!analytics) return;

//     const sheetData = analytics.studentDetails.map((student) => {
//       return {
//         'Student Name': student.studentName,
//         Department: student.department,
//         'Registration Number': student.registrationNumber,
//         College: student.collegeName,
//         'Tests Taken': student.testsTaken,
//         'Passed Count': student.testResults.filter((res) => res.pass).length,
//         'Failed Count': student.testsTaken - student.testResults.filter((res) => res.pass).length,
//         'Test Details': student.testResults.map((res) => `${res.testName}: ${res.pass ? 'Pass' : 'Fail'} (Marks: ${res.marks}, Time: ${res.timeTaken})`).join(', ')
//       };
//     });

//     const ws = XLSX.utils.json_to_sheet(sheetData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Department Analytics');
//     XLSX.writeFile(wb, 'department-analytics.xlsx');
//   };

//   const exportStudentAsPDF = (student: StudentDetails) => {
//     const doc = new jsPDF();
//     doc.text(`Student: ${student.studentName}`, 10, 10);
//     doc.text(`Department: ${student.department}`, 10, 20);
//     doc.text(`Registration Number: ${student.registrationNumber}`, 10, 30);
//     doc.text(`College: ${student.collegeName}`, 10, 40);

//     const tableData = student.testResults.map((test) => [
//       test.testName,
//       test.pass ? 'Pass' : 'Fail',
//       test.marks,
//       test.timeTaken
//     ]);

//     autoTable(doc, {
//       head: [['Test Name', 'Pass/Fail', 'Marks', 'Time Taken']],
//       body: tableData,
//       startY: 50,
//     });

//     doc.save(`${student.studentName}-details.pdf`);
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
//   }
//   if (analytics?.totalStudents===0) {
//     return <div className="text-center text-red-600">No analytics data available.</div>;
//   }

//   return (
//     <div className="min-h-screen p-4">
//       <h1 className="text-3xl font-bold mb-4">Department Analytics: {analytics?.department}</h1>
//       <div className="flex justify-between mb-6">
//         <button onClick={exportAllAsCSV} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
//           Export All as CSV
//         </button>
//         <button onClick={exportAllAsXLSX} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
//           Export All as XLSX
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="px-4 py-2 border">Student Name</th>
//               <th className="px-4 py-2 border">Department</th>
//               <th className="px-4 py-2 border">Registration Number</th>
//               <th className="px-4 py-2 border">College Name</th>
//               <th className="px-4 py-2 border">Tests Taken</th>
//               <th className="px-4 py-2 border">Passed</th>
//               <th className="px-4 py-2 border">Failed</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {analytics?.studentDetails.map((student) => (
//               <tr key={student.registrationNumber} className='text-center'>
//                 <td className="px-4 py-2 border">{student.studentName}</td>
//                 <td className="px-4 py-2 border">{student.department}</td>
//                 <td className="px-4 py-2 border">{student.registrationNumber}</td>
//                 <td className="px-4 py-2 border">{student.collegeName}</td>
//                 <td className="px-4 py-2 border">{student.testsTaken}</td>
//                 <td className="px-4 py-2 border">{student.testResults.filter((res) => res.pass).length}</td>
//                 <td className="px-4 py-2 border">{student.testsTaken - student.testResults.filter((res) => res.pass).length}</td>
//                 <td className="px-4 py-2 border">
//                   <button
//                     onClick={() => exportStudentAsPDF(student)}
//                     className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
//                   >
//                     Export PDF
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AnalyticPage;
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Define types for the department analytics and student details
interface TestResult {
  testName: string;
  pass: boolean;
  timeTaken: number;
  marks: number;
}

interface StudentDetails {
  studentName: string;
  department: string;
  registrationNumber: string;
  collegeName: string;
  testsTaken: number;
  testResults: TestResult[];
}

interface DepartmentAnalytics {
  department: string;
  totalStudents: number;
  totalTestsTaken: number;
  passedCount: number;
  failedCount: number;
  studentDetails: StudentDetails[];
}

interface Props {
  department: string;
}

const AnalyticPage: React.FC<Props> = ({ department }) => {
  const [analytics, setAnalytics] = useState<DepartmentAnalytics | null>(null);
  const [testTaken, setTestTaken] = useState<number>(0);

  const [studentDetails, setStudentDetails] = useState<StudentDetails[] | []>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const dataSource: StudentDetails[] = [...studentDetails];

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Registration Number",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: "College Name",
      dataIndex: "collegeName",
      key: "collegeName",
    },
    {
      title: "Tests Taken",
      dataIndex: "testsTaken",
      key: "testsTaken",
    },
    {
      title: "Passed",
      dataIndex: "testResults",
      key: "testResults",
      render: (testResults: TestResult[]) => (
        <p>{testResults.filter((res) => res.pass).length}</p>
      ),
    },
    {
      title: "Failed",
      dataIndex: "testResults",
      key: "testResults",
      render: (testResults: TestResult[]) => (
        <p>{testTaken - testResults.filter((res) => res.pass).length}</p>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (student: StudentDetails) => (
        <button
          className="w-[90%] py-2 font-medium text-white rounded-md text-md bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
          onClick={() => exportStudentAsPDF(student)}
        >
          Export PDF
        </button>
      ),
    },
  ];

  const exportStudentAsPDF = (student: StudentDetails) => {
    const doc = new jsPDF();
    doc.text(`Student: ${student.studentName}`, 10, 10);
    doc.text(`Department: ${student.department}`, 10, 20);
    doc.text(`Registration Number: ${student.registrationNumber}`, 10, 30);
    doc.text(`College: ${student.collegeName}`, 10, 40);

    const tableData = student.testResults.map((test) => [
      test.testName,
      test.pass ? "Pass" : "Fail",
      test.marks,
      test.timeTaken,
    ]);

    autoTable(doc, {
      head: [["Test Name", "Pass/Fail", "Marks", "Time Taken"]],
      body: tableData,
      startY: 50,
    });

    doc.save(`${student.studentName}-details.pdf`);
  };

  const exportAllAsCSV = () => {
    if (!analytics) return;

    const csvData = analytics.studentDetails.map((student) => {
      return {
        studentName: student.studentName,
        department: student.department,
        registrationNumber: student.registrationNumber,
        collegeName: student.collegeName,
        testsTaken: student.testsTaken,
        passedCount: student.testResults.filter((res) => res.pass).length,
        failedCount:
          student.testsTaken -
          student.testResults.filter((res) => res.pass).length,
        testDetails: student.testResults
          .map(
            (res) =>
              `${res.testName}: ${res.pass ? "Pass" : "Fail"} (Marks: ${
                res.marks
              }, Time: ${res.timeTaken})`
          )
          .join(", "),
      };
    });

    const csvRows = [
      [
        "Student Name",
        "Department",
        "Registration Number",
        "College Name",
        "Tests Taken",
        "Passed",
        "Failed",
        "Test Details",
      ],
      ...csvData.map((row) => [
        row.studentName,
        row.department,
        row.registrationNumber,
        row.collegeName,
        row.testsTaken,
        row.passedCount,
        row.failedCount,
        row.testDetails,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "department-analytics.csv");
  };

  const exportAllAsXLSX = () => {
    if (!analytics) return;

    const sheetData = analytics.studentDetails.map((student) => {
      return {
        "Student Name": student.studentName,
        Department: student.department,
        "Registration Number": student.registrationNumber,
        College: student.collegeName,
        "Tests Taken": student.testsTaken,
        "Passed Count": student.testResults.filter((res) => res.pass).length,
        "Failed Count":
          student.testsTaken -
          student.testResults.filter((res) => res.pass).length,
        "Test Details": student.testResults
          .map(
            (res) =>
              `${res.testName}: ${res.pass ? "Pass" : "Fail"} (Marks: ${
                res.marks
              }, Time: ${res.timeTaken})`
          )
          .join(", "),
      };
    });

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Department Analytics");
    XLSX.writeFile(wb, "department-analytics.xlsx");
  };

  useEffect(() => {
    axios
      .get(
        `https://quiz-server-sigma.vercel.app/responses/analytics/department/${department}`,
        { headers }
      )
      .then((response) => {
        setAnalytics(response.data);
        setStudentDetails(response?.data?.studentDetails);
        setTestTaken(response?.data?.totalTestsTaken);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      });
  }, [department]);

  return (
    <div className="flex flex-col w-full h-full gap-5">
      <div className="flex justify-between">
        <p className="text-xl font-bold">Department Analytics</p>
        <p className="text-xl font-bold">Department: {department}</p>
      </div>
      <div className="w-full h-[25%] bg-white rounded-lg shadow-md flex justify-between px-16 py-5">
        <div
          className="flex flex-col px-10 justify-center w-[20%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
          style={{
            clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <p className="text-xl font-medium">Total Assessment</p>
          <p className="text-3xl font-semibold text-teal-600">12</p>
        </div>
        <div
          className="flex flex-col px-10 justify-center w-[20%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
          style={{
            clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <p className="text-xl font-medium">Completed Assessment</p>
          <p className="text-3xl font-semibold text-teal-600">8</p>
        </div>
        <div
          className="flex flex-col px-10 justify-center w-[20%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
          style={{
            clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <p className="text-xl font-medium">Incomplete Assessment</p>
          <p className="text-3xl font-semibold text-teal-600">4</p>
        </div>
      </div>
      <div className="max-h-[70%] min-h-[40%] flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="w-[60%]">
            <p className="text-xl font-bold">Student Analytics</p>
          </div>
          <div className="flex w-[40%] justify-end gap-5">
            <button
              className="w-[30%] py-2 text-md font-medium text-white rounded-md bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
              onClick={exportAllAsCSV}
            >
              Export All as CSV
            </button>
            <button
              className="w-[30%] py-2 text-md font-medium text-white rounded-md bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
              onClick={exportAllAsXLSX}
            >
              Export All as XLSX
            </button>
          </div>
        </div>
        <div className="h-full bg-white rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="registrationNumber"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;