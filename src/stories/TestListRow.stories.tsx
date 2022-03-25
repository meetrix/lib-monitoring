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
  type: 'success',
  message: 'No issues found',
};

export const Fail = Template.bind({});
Fail.args = {
  type: 'error',
  message: 'There is a problem with your microphone',
};

export const Running = Template.bind({});
Running.args = {
  type: 'running',
};

export const Result = Template.bind({});
Result.args = {
  type: 'blackIcon',
};

export const Unset = Template.bind({});
Unset.args = {
  type: 'unset',
};