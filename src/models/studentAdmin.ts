import { useState } from 'react';

export default function StudentAdminModel() {
  const [data, setData] = useState<Student.Info[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<Student.Info | null>(null);

  const saveToLocalStorage = (students: Student.Info[]) => {
    localStorage.setItem('studentData', JSON.stringify(students));
  };

  const getStudentData = () => {
    try {
      const dataLocal = JSON.parse(localStorage.getItem('studentData') || '[]') as Student.Info[];
      setData(dataLocal);
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
      setData([]);
    }
  };

  const addStudent = (student: Student.Info) => {
    const exists = data.some((s) => s.studentId === student.studentId);
    if (exists) {
      const newData = data.map((s) =>
        s.studentId === student.studentId ? student : s
      );
      setData(newData);
      saveToLocalStorage(newData);
    } else {
      const newData = [...data, student];
      setData(newData);
      saveToLocalStorage(newData);
    }
  };

  const updateStudent = (student: Student.Info) => {
    const newData = data.map((item) =>
      item.studentId === student.studentId ? student : item
    );
    setData(newData);
    saveToLocalStorage(newData);
  };

  const deleteStudent = (studentId: string) => {
    const newData = data.filter((item) => item.studentId !== studentId);
    setData(newData);
    saveToLocalStorage(newData);
  };

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit,
    setIsEdit,
    setData,
    getStudentData,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
