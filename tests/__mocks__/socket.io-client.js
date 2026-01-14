// Mock for socket.io-client
const mockSocket = {
	on: jest.fn(),
	emit: jest.fn(),
	connected: false
};

const io = jest.fn(() => mockSocket);

module.exports = {
	io,
	__mockSocket: mockSocket
};