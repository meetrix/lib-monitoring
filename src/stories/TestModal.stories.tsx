import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TestModal from '../ui/components/TestModal';
import { generateFakeStateList } from '../utils/webrtctests/fakeStateGenerator';

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

const sampleData = generateFakeStateList({
  component: 'network',
  status: 'failure',
  subComponent: 'connection-reflexive',
});

const Template: ComponentStory<typeof TestModal> = args => <TestModal {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  open: true,
  data: sampleData,
};
