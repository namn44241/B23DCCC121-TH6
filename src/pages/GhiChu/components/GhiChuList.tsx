import { useModel } from 'umi';
import { List, Tag, Space, Tooltip, Typography, Popconfirm } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	StarOutlined,
	StarFilled,
	PushpinOutlined,
	PushpinFilled,
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

interface GhiChuListProps {
	danhSach: GhiChu.IRecord[];
}

const GhiChuList = ({ danhSach }: GhiChuListProps) => {
	const { setVisibleForm, setEdit, setRecord, xoaGhiChu, toggleQuanTrong, toggleGhim } = useModel('ghichu');

	const handleEdit = (record: GhiChu.IRecord) => {
		setEdit(true);
		setRecord(record);
		setVisibleForm(true);
	};

	return (
		<List
			itemLayout="vertical"
			dataSource={danhSach}
			renderItem={(item) => (
				<List.Item
					key={item._id}
					className={`ghi-chu-list-item ${item.quanTrong ? 'quan-trong' : ''} ${item.ghim ? 'ghim' : ''}`}
					actions={[
						<Space key="actions">
							<Tooltip title={item.quanTrong ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}>
								{item.quanTrong ? (
									<StarFilled onClick={() => toggleQuanTrong(item._id)} style={{ color: '#faad14' }} />
								) : (
									<StarOutlined onClick={() => toggleQuanTrong(item._id)} />
								)}
							</Tooltip>
							<Tooltip title={item.ghim ? 'Bỏ ghim' : 'Ghim ghi chú'}>
								{item.ghim ? (
									<PushpinFilled onClick={() => toggleGhim(item._id)} style={{ color: '#1890ff' }} />
								) : (
									<PushpinOutlined onClick={() => toggleGhim(item._id)} />
								)}
							</Tooltip>
							<Tooltip title="Chỉnh sửa">
								<EditOutlined onClick={() => handleEdit(item)} />
							</Tooltip>
							<Popconfirm
								title="Bạn có chắc chắn muốn xóa ghi chú này?"
								onConfirm={() => xoaGhiChu(item._id)}
								okText="Xóa"
								cancelText="Hủy"
							>
								<DeleteOutlined />
							</Popconfirm>
						</Space>,
					]}
					extra={
						<Text type="secondary" style={{ fontSize: '12px' }}>
							{moment(item.ngayTao).format('HH:mm DD/MM/YYYY')}
						</Text>
					}
				>
					<List.Item.Meta
						title={item.tieuDe}
						description={
							<Space direction="vertical" size={8}>
								<div>{item.noiDung}</div>
								<div>
									{item.tag.map((tag) => (
										<Tag key={tag}>{tag}</Tag>
									))}
								</div>
							</Space>
						}
					/>
				</List.Item>
			)}
		/>
	);
};

export default GhiChuList; 