import Mustache from 'mustache';

const Template = {
  render: (template: string, options: any) => {
    return Mustache.render(template, options);
  }
};

export { Template };