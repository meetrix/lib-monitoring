import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import  CheckListRow  from '../ui/components/CheckListRow';

export default {
  title: 'Example/CheckListRow',
  component: CheckListRow,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CheckListRow>;

const Template: ComponentStory<typeof CheckListRow> = (args) => <CheckListRow {...args} />;

export const Success = Template.bind({});
Success.args = {
  type: 'success',
};

export const Fail = Template.bind({});
Fail.args = {
  type: 'fail',
};

export const Running = Template.bind({});
Running.args = {
  type: 'running',
};

export const Result = Template.bind({});
Result.args = {
  type: 'result',
};

export const Unset = Template.bind({});
Unset.args = {
  type: 'unset',
};