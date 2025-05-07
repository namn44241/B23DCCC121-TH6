import { useModel } from 'umi';
import { Card, Tag, Space, Tooltip, Typography, Popconfirm } from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	StarOutlined,
	StarFilled,
	PushpinOutlined,
	PushpinFilled,
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Paragraph } = Typography;

interface GhiChuCardProps {
	record: GhiChu.IRecord;
}

const GhiChuCard = ({ record }: GhiChuCardProps) => {
	const { setVisibleForm, setEdit, setRecord, xoaGhiChu, toggleQuanTrong, toggleGhim } = useModel('ghichu');

	const handleEdit = () => {
		setEdit(true);
		setRecord(record);
		setVisibleForm(true);
	};

	return (
		<Card
			hoverable
			className={`ghi-chu-card ${record.quanTrong ? 'quan-trong' : ''} ${record.ghim ? 'ghim' : ''}`}
			actions={[
				<Tooltip title={record.quanTrong ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}>
					{record.quanTrong ? (
						<StarFilled onClick={() => toggleQuanTrong(record._id)} style={{ color: '#faad14' }} />
					) : (
						<StarOutlined onClick={() => toggleQuanTrong(record._id)} />
					)}
				</Tooltip>,
				<Tooltip title={record.ghim ? 'Bỏ ghim' : 'Ghim ghi chú'}>
					{record.ghim ? (
						<PushpinFilled onClick={() => toggleGhim(record._id)} style={{ color: '#1890ff' }} />
					) : (
						<PushpinOutlined onClick={() => toggleGhim(record._id)} />
					)}
				</Tooltip>,
				<Tooltip title="Chỉnh sửa">
					<EditOutlined onClick={handleEdit} />
				</Tooltip>,
				<Popconfirm
					title="Bạn có chắc chắn muốn xóa ghi chú này?"
					onConfirm={() => xoaGhiChu(record._id)}
					okText="Xóa"
					cancelText="Hủy"
				>
					<DeleteOutlined />
				</Popconfirm>,
			]}
		>
			<div className="card-header">
				<Typography.Title level={5} ellipsis={{ rows: 1 }}>
					{record.tieuDe}
				</Typography.Title>
			</div>
			<Paragraph ellipsis={{ rows: 3 }}>{record.noiDung}</Paragraph>
			<div className="card-footer">
				<Space direction="vertical" size={4} style={{ width: '100%' }}>
					<Text type="secondary" style={{ fontSize: '12px' }}>
						{moment(record.ngayTao).format('HH:mm DD/MM/YYYY')}
					</Text>
					<div className="tag-container">
						{record.tag.map((tag) => (
							<Tag key={tag}>{tag}</Tag>
						))}
					</div>
				</Space>
			</div>
		</Card>
	);
};

export default GhiChuCard; 