import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import  TestModal  from '../ui/components/TestModal';

export default {
  title: 'Example/TestModal',
  component: TestModal,
  argTypes: {
    label: {
      defaultValue: true,
      control: { type: 'bool' }
    },
  },
} as ComponentMeta<typeof TestModal>;

const Template: ComponentStory<typeof TestModal> = (args) => <TestModal {...args} />;

export const Sample = Template.bind({});
Sample.args = {
  open: true,
};