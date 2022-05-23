import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import  TestListRow  from '../ui/components/TestListRow';

export default {
  title: 'Example/TestListRow',
  component: TestListRow,
  argTypes: {
    label: {
      defaultValue: 'Checking your microphone',
      control: { type: 'text' }
    },
  },
} as ComponentMeta<typeof TestListRow>;

const Template: ComponentStory<typeof TestListRow> = (args) => <TestListRow {...args} />;

export const Success = Template.bind({});
Success.args = {
  status: 'success',
  message: 'No issues found',
};

export const Fail = Template.bind({});
Fail.args = {
  status: 'error',
  message: 'There is a problem with your microphone',
};

export const Running = Template.bind({});
Running.args = {
  status: 'running',
};

export const Result = Template.bind({});
Result.args = {
  status: 'blackIcon',
};

export const Unset = Template.bind({});
Unset.args = {
  status: 'unset',
};