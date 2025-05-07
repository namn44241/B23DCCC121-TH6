declare module GhiChu {
	export interface IRecord {
		_id: string;
		tieuDe: string;
		noiDung: string;
		ngayTao: string;
		tag: string[];
		quanTrong: boolean;
		ghim: boolean;
	}

	export interface IFilter {
		tuKhoa?: string;
		tag?: string[];
		tuNgay?: string;
		denNgay?: string;
		quanTrong?: boolean;
	}
} 