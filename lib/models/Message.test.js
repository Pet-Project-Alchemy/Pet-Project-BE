const Message = require('./Message');

describe('Message model', () => {
  it('has who the receiverId', () => {
    const message = new Message();
    const { errors } = message.validateSync();
    expect(errors.receiverId.message).toEqual('Path `receiverId` is required.');
  });
  it('has senderId', () => {
    const message = new Message();
    const { errors } = message.validateSync();
    expect(errors.senderId.message).toEqual('Path `senderId` is required.');
  });
  it('has a text', () => {
    const message = new Message();
    const { errors } = message.validateSync();
    expect(errors.text.message).toEqual('Path `text` is required.');
  });
});

