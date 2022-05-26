import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TestModal from '../ui/components/TestModal';
import { ITestView } from '../ui/slice/types';
import { generateFakeState } from '../utils/webrtctests/fakeStateGenerator';

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
  generateFakeState({
    component: 'browser',
    status: 'success',
    subComponent: 'default',
  }),
  generateFakeState({
    component: 'microphone',
    status: 'success',
    subComponent: 'default',
  }),
  generateFakeState({
    component: 'camera',
    status: 'success',
    subComponent: 'default',
  }),
  generateFakeState({
    component: 'network',
    status: 'failure',
    subComponent: 'bandwidth-throughput',
  }),
] as ITestView[];

const Template: ComponentStory<typeof TestModal> = args => <TestModal {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  open: true,
  data: sampleData,
};
