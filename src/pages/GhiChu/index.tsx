import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import {
	Card,
	Button,
	Input,
	Row,
	Col,
	Select,
	DatePicker,
	Space,
	Checkbox,
	Radio,
	Empty,
} from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	AppstoreOutlined,
	UnorderedListOutlined,
	FilterOutlined,
} from '@ant-design/icons';
import { ECheDoXem, DEFAULT_TAGS } from '@/services/GhiChu/constant';
import GhiChuCard from './components/GhiChuCard';
import GhiChuList from './components/GhiChuList';
import FormGhiChu from './components/Form';
import moment from 'moment';
import './style.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const GhiChuPage = () => {
	const {
		getDanhSachLoc,
		setVisibleForm,
		setEdit,
		setRecord,
		cheDoXem,
		setCheDoXem,
		filter,
		setFilter,
	} = useModel('ghichu');
	const [showFilter, setShowFilter] = useState<boolean>(false);

	const handleThemMoi = () => {
		setEdit(false);
		setRecord(undefined);
		setVisibleForm(true);
	};

	const handleFilter = (key: string, value: any) => {
		setFilter({ ...filter, [key]: value });
	};

	const handleResetFilter = () => {
		setFilter({});
	};

	const danhSachLoc = getDanhSachLoc();

	return (
		<Card
			title="Ghi chú cá nhân"
			extra={
				<Space>
					<Button
						icon={<FilterOutlined />}
						onClick={() => setShowFilter(!showFilter)}
						type={showFilter ? 'primary' : 'default'}
					>
						Bộ lọc
					</Button>
					<Radio.Group
						value={cheDoXem}
						onChange={(e) => setCheDoXem(e.target.value)}
						buttonStyle="solid"
					>
						<Radio.Button value={ECheDoXem.LUOI}>
							<AppstoreOutlined />
						</Radio.Button>
						<Radio.Button value={ECheDoXem.DANH_SACH}>
							<UnorderedListOutlined />
						</Radio.Button>
					</Radio.Group>
					<Button type="primary" icon={<PlusOutlined />} onClick={handleThemMoi}>
						Thêm ghi chú
					</Button>
				</Space>
			}
		>
			{showFilter && (
				<Card className="filter-card" size="small">
					<Row gutter={[16, 16]}>
						<Col xs={24} md={8}>
							<Input
								placeholder="Tìm kiếm theo tiêu đề, nội dung"
								prefix={<SearchOutlined />}
								value={filter.tuKhoa}
								onChange={(e) => handleFilter('tuKhoa', e.target.value)}
								allowClear
							/>
						</Col>
						<Col xs={24} md={8}>
							<Select
								mode="multiple"
								placeholder="Chọn tag"
								style={{ width: '100%' }}
								value={filter.tag}
								onChange={(value) => handleFilter('tag', value)}
								allowClear
							>
								{DEFAULT_TAGS.map((tag) => (
									<Option key={tag} value={tag}>
										{tag}
									</Option>
								))}
							</Select>
						</Col>
						<Col xs={24} md={8}>
							<RangePicker
								style={{ width: '100%' }}
								placeholder={['Từ ngày', 'Đến ngày']}
								value={
									filter.tuNgay && filter.denNgay
										? [moment(filter.tuNgay), moment(filter.denNgay)]
										: undefined
								}
								onChange={(dates) => {
									if (dates) {
										handleFilter('tuNgay', dates[0]?.toISOString());
										handleFilter('denNgay', dates[1]?.toISOString());
									} else {
										handleFilter('tuNgay', undefined);
										handleFilter('denNgay', undefined);
									}
								}}
							/>
						</Col>
						<Col xs={24}>
							<Space>
								<Checkbox
									checked={filter.quanTrong}
									onChange={(e) => handleFilter('quanTrong', e.target.checked)}
								>
									Chỉ hiển thị ghi chú quan trọng
								</Checkbox>
								<Button onClick={handleResetFilter}>Xóa bộ lọc</Button>
							</Space>
						</Col>
					</Row>
				</Card>
			)}

			{danhSachLoc.length === 0 ? (
				<Empty description="Không có ghi chú nào" />
			) : (
				<div className="ghi-chu-container">
					{cheDoXem === ECheDoXem.LUOI ? (
						<Row gutter={[16, 16]}>
							{danhSachLoc.map((item) => (
								<Col xs={24} sm={12} md={8} lg={6} key={item._id}>
									<GhiChuCard record={item} />
								</Col>
							))}
						</Row>
					) : (
						<GhiChuList danhSach={danhSachLoc} />
					)}
				</div>
			)}

			<FormGhiChu />
		</Card>
	);
};

export default GhiChuPage; 