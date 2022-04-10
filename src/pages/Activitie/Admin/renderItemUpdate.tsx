import { Box } from '@mui/material';
import { Button, Form, Input, Table, DatePicker, message, Select } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import prompt from '../../../components/Prompt';
import { IOfficer } from '../../../redux/types/authI';
import { ActivitiesI } from '../../../services/activites';
import { getDepartment, getSection, SectionI } from '../../../services/department';
import { DepartmentI } from '../../../services/officer';
import Hook from './hook';
const { RangePicker } = DatePicker;
const { Option } = Select;
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
};
const RenderItemUpdate = ({ activity }: { activity: ActivitiesI }) => {
  const [departments, setDepartments] = useState<DepartmentI[]>([]);
  const [sections, setSections] = useState<SectionI[]>([]);
  useEffect(() => {
    // getDepartment()
    //   .then((res) => {
    //     setDepartments(res.data.reverse());
    //   })
    //   .catch((e) => {
    //     message.error(e.toString());
    //   });
  }, []);
  const onChangetDepartment = async (value: string) => {
    // setSections([]);
    // const a: SectionI[] = await getSection({ idDPM: value })
    //   .then((res) => {
    //     return res.data.reverse();
    //   })
    //   .catch((e: any) => {
    //     message.error(e.toString());
    //     return [];
    //   })
    //   .finally(() => {
    //     return [];
    //   });
    // setSections(a);
  };
  return (
    <React.Fragment>
      <Form.Item
        label="Name"
        initialValue={activity.name}
        name="name"
        rules={[{ required: true, message: 'Please input dpm' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item initialValue={activity.description} name={'description'} label="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="Date"
        initialValue={
          activity.date
            ? [
                moment(new Date(activity.date[0]), 'YYYY-MM-DD HH:mm:ss'),
                moment(new Date(activity.date[1]), 'YYYY-MM-DD HH:mm:ss'),
              ]
            : []
        }
        label="RangeDate"
        {...rangeConfig}
      >
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      {/* <Form.Item name="department" label="department" rules={[{ required: true }]}>
        <Select
          onChange={onChangetDepartment}
          disabled={true}
          placeholder="Select a option and change input text above"
          allowClear
        >
          {departments.map((d, i) => {
            return (
              <Option key={i} value={d._id}>
                {d.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item> */}
      <Form.Item
        name="section"
        initialValue={activity.section_name}
        label="section"
        rules={[{ required: true }]}
      >
        <Select
          disabled={true}
          placeholder="Select a option and change input text above"
          allowClear
        >
          {sections.map((s, i) => {
            return (
              <Option key={i} value={JSON.stringify(s)}>
                {s.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        label="location"
        name="location"
        initialValue={activity.location}
        rules={[{ required: true, message: 'Please input location' }]}
      >
        <Input />
      </Form.Item>
    </React.Fragment>
  );
};
export default RenderItemUpdate;