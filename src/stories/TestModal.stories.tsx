import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TestModal from '../ui/components/TestModal';

export default {
  title: 'Example/TestModal',
  component: TestModal,
  argTypes: {
    label: {
      defaultValue: true,
      control: { type: 'bool' },
    },
  },
} as ComponentMeta<typeof TestModal>;

const sampleData = [
  {
    key: 'browser',
    label: 'Checking your browser',
    status: 'failure',
    message: 'Your browser is not compatible',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'microphone',
    label: 'Checking your microphone',
    status: 'success',
    message: 'No issues found',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'camera',
    label: 'Checking your camera',
    status: 'running',
    message: '',
    subMessages: {},
    subStatus: {},
  },
  {
    key: 'network',
    label: 'Checking your network connection',
    status: '',
    message: '',
    subMessages: {},
    subStatus: {},
  },
];

const Template: ComponentStory<typeof TestModal> = args => <TestModal {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  open: true,
  data: sampleData,
};
