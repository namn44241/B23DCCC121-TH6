import { message } from 'antd';
import { useEffect, useState } from 'react';
import { ECheDoXem, STORAGE_KEY } from '@/services/GhiChu/constant';
import { v4 as uuidv4 } from 'uuid';

export default () => {
	const [danhSach, setDanhSach] = useState<GhiChu.IRecord[]>([]);
	const [record, setRecord] = useState<GhiChu.IRecord>();
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [cheDoXem, setCheDoXem] = useState<ECheDoXem>(ECheDoXem.LUOI);
	const [filter, setFilter] = useState<GhiChu.IFilter>({});

	// Lấy dữ liệu từ localStorage khi khởi tạo
	useEffect(() => {
		const storedData = localStorage.getItem(STORAGE_KEY);
		if (storedData) {
			try {
				setDanhSach(JSON.parse(storedData));
			} catch (error) {
				console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
			}
		}
	}, []);

	// Lưu dữ liệu vào localStorage khi danhSach thay đổi
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSach));
	}, [danhSach]);

	// Lấy danh sách ghi chú đã lọc
	const getDanhSachLoc = (): GhiChu.IRecord[] => {
		let result = [...danhSach];

		// Lọc theo từ khóa
		if (filter.tuKhoa) {
			const keyword = filter.tuKhoa.toLowerCase();
			result = result.filter(
				(item) =>
					item.tieuDe.toLowerCase().includes(keyword) ||
					item.noiDung.toLowerCase().includes(keyword),
			);
		}

		// Lọc theo tag
		if (filter.tag && filter.tag.length > 0) {
			result = result.filter((item) => 
				item.tag.some((tag) => filter.tag?.includes(tag))
			);
		}

		// Lọc theo ngày
		if (filter.tuNgay) {
			result = result.filter(
				(item) => new Date(item.ngayTao) >= new Date(filter.tuNgay as string),
			);
		}

		if (filter.denNgay) {
			result = result.filter(
				(item) => new Date(item.ngayTao) <= new Date(filter.denNgay as string),
			);
		}

		// Lọc theo quan trọng
		if (filter.quanTrong) {
			result = result.filter((item) => item.quanTrong);
		}

		// Sắp xếp: ghim lên đầu, sau đó theo ngày tạo mới nhất
		result.sort((a, b) => {
			if (a.ghim && !b.ghim) return -1;
			if (!a.ghim && b.ghim) return 1;
			return new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime();
		});

		return result;
	};

	// Thêm ghi chú mới
	const themGhiChu = (values: Omit<GhiChu.IRecord, '_id' | 'ngayTao'>): void => {
		const newRecord: GhiChu.IRecord = {
			_id: uuidv4(),
			...values,
			ngayTao: new Date().toISOString(),
		};

		setDanhSach([...danhSach, newRecord]);
		message.success('Thêm ghi chú thành công');
		setVisibleForm(false);
	};

	// Cập nhật ghi chú
	const capNhatGhiChu = (id: string, values: Partial<GhiChu.IRecord>): void => {
		const updatedList = danhSach.map((item) =>
			item._id === id ? { ...item, ...values } : item,
		);
		setDanhSach(updatedList);
		message.success('Cập nhật ghi chú thành công');
		setVisibleForm(false);
	};

	// Xóa ghi chú
	const xoaGhiChu = (id: string): void => {
		setDanhSach(danhSach.filter((item) => item._id !== id));
		message.success('Xóa ghi chú thành công');
	};

	// Đánh dấu ghi chú quan trọng
	const toggleQuanTrong = (id: string): void => {
		const updatedList = danhSach.map((item) =>
			item._id === id ? { ...item, quanTrong: !item.quanTrong } : item,
		);
		setDanhSach(updatedList);
	};

	// Ghim/bỏ ghim ghi chú
	const toggleGhim = (id: string): void => {
		const updatedList = danhSach.map((item) =>
			item._id === id ? { ...item, ghim: !item.ghim } : item,
		);
		setDanhSach(updatedList);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		loading,
		setLoading,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		cheDoXem,
		setCheDoXem,
		filter,
		setFilter,
		getDanhSachLoc,
		themGhiChu,
		capNhatGhiChu,
		xoaGhiChu,
		toggleQuanTrong,
		toggleGhim,
	};
}; 