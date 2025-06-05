import React, { useEffect, useState } from 'react';
import { Tabs, message, Input, Button } from 'antd';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import BorrowTable from './BorrowTable';
import * as XLSX from 'xlsx';

const { TabPane } = Tabs;

const BorrowManagerTabs: React.FC = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('borrowData');
    const parsed: BorrowRecord[] = stored ? JSON.parse(stored) : [];
    setData(parsed);
  }, []);

  const updateStatus = (id: number, newStatus: BorrowStatus, reason?: string) => {
    const newData = data.map((record) =>
      record.id === id
        ? {
            ...record,
            status: newStatus,
            ...(newStatus === 'rejected' && reason ? { rejectReason: reason } : {}),
          }
        : record
    );
    localStorage.setItem('borrowData', JSON.stringify(newData));
    setData(newData);
    message.success('Cập nhật trạng thái thành công!');
  };

  const getDataByStatus = (status: BorrowStatus | 'all') => {
    const filtered = status === 'all' ? data : data.filter((item) => item.status === status);
    return filtered.filter((record) =>
      record.deviceName.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const exportToExcel = (records: BorrowRecord[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'YeuCauMuon');

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const renderTab = (key: BorrowStatus | 'all', label: string) => {
    const filtered = getDataByStatus(key);
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Input
            placeholder="Tìm theo tên thiết bị"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button onClick={() => exportToExcel(filtered, `yeu_cau_${key}`)}>
            Xuất Excel
          </Button>
        </div>
        <BorrowTable data={filtered} status={key} onUpdateStatus={updateStatus} />
      </div>
    );
  };

  return (
    <div>
      <h2>Quản lý yêu cầu mượn thiết bị</h2>
      <Tabs defaultActiveKey="waiting">
        <TabPane tab="Chờ duyệt" key="waiting">
          {renderTab('waiting', 'Chờ duyệt')}
        </TabPane>
        <TabPane tab="Đang mượn" key="borrowing">
          {renderTab('borrowing', 'Đang mượn')}
        </TabPane>
        <TabPane tab="Đã trả" key="returned">
          {renderTab('returned', 'Đã trả')}
        </TabPane>
        <TabPane tab="Từ chối" key="rejected">
          {renderTab('rejected', 'Từ chối')}
        </TabPane>
        <TabPane tab="Quá hạn" key="overdue">
          {renderTab('overdue', 'Quá hạn')}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BorrowManagerTabs;
