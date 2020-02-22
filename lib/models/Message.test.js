const Message = require('./Message');

describe('Message model', () => {
  it('has who the message is going to', () => {
    const message = new Message();
    const { errors } = message.validateSync();
  
    expect(errors.to.message).toEqual('Path `to` is required.');
  });
  it('has who the message is from', () => {
    const message = new Message();
    const { errors } = message.validateSync();
  
    expect(errors.from.message).toEqual('Path `from` is required.');
  });
  it('has a title', () => {
    const message = new Message();
    const { errors } = message.validateSync();
    expect(errors.title.message).toEqual('Path `title` is required.');
  });
  it('has a text', () => {
    const message = new Message();
    const { errors } = message.validateSync();
    expect(errors.text.message).toEqual('Path `text` is required.');
  });
});

