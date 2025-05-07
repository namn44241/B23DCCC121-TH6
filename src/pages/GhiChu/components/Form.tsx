import { useEffect } from 'react';
import { useModel } from 'umi';
import { Modal, Form, Input, Select, Checkbox, Button } from 'antd';
import { DEFAULT_TAGS } from '@/services/GhiChu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

const { TextArea } = Input;
const { Option } = Select;

const FormGhiChu = () => {
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, record, edit, themGhiChu, capNhatGhiChu } = useModel('ghichu');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record && edit) {
			form.setFieldsValue({
				...record,
			});
		}
	}, [visibleForm, record, edit]);

	const onFinish = (values: any) => {
		if (edit && record) {
			capNhatGhiChu(record._id, values);
		} else {
			themGhiChu(values);
		}
	};

	return (
		<Modal
			title={edit ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới'}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout="vertical" onFinish={onFinish}>
				<Form.Item name="tieuDe" label="Tiêu đề" rules={[...rules.required]}>
					<Input placeholder="Nhập tiêu đề ghi chú" />
				</Form.Item>

				<Form.Item name="noiDung" label="Nội dung" rules={[...rules.required]}>
					<TextArea rows={4} placeholder="Nhập nội dung ghi chú" />
				</Form.Item>

				<Form.Item name="tag" label="Tag" rules={[...rules.required]}>
					<Select
						mode="multiple"
						placeholder="Chọn tag"
						style={{ width: '100%' }}
						allowClear
					>
						{DEFAULT_TAGS.map((tag) => (
							<Option key={tag} value={tag}>
								{tag}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name="quanTrong" valuePropName="checked">
					<Checkbox>Đánh dấu là quan trọng</Checkbox>
				</Form.Item>

				<Form.Item name="ghim" valuePropName="checked">
					<Checkbox>Ghim ghi chú</Checkbox>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit" block>
						{edit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormGhiChu; 