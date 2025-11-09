import { Table as AntTable, TableProps as AntTableProps } from 'antd';

interface TableProps {
  className: string;
  columns: AntTableProps['columns'];
  dataSource: AntTableProps['dataSource'];
  pagination?: AntTableProps['pagination'];
  rowKey: AntTableProps['rowKey'];
};


export function Table({
  className,
  columns,
  dataSource,
  pagination,
  rowKey,
}: TableProps) {
  return (
    <AntTable
      className={className}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      rowKey={rowKey}
    />
  );
}
