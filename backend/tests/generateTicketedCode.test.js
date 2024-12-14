const generateTicketedCode = require('../utils/createTicketId');
const Report = require('../models/Report'); // Mocked model

// Mock the Report model
jest.mock('../models/Report', () => ({
    findOne: jest.fn(),
}));

describe('generateTicketedCode', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('should generate a ticketed code starting with today\'s date', async () => {
        // Mock no existing report in the database
        Report.findOne.mockResolvedValue(null);

        const code = await generateTicketedCode();

        // Check the format of the generated code
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;

        expect(code.startsWith(datePrefix)).toBe(true);
        expect(code.length).toBe(datePrefix.length + 4); // Includes the sequence part
    });

    test('should increment sequence number if a report with today\'s date exists', async () => {
        // Mock a report with the latest ticketedCode
        Report.findOne.mockResolvedValue({ ticketedCode: '202412110001' });

        const code = await generateTicketedCode();

        expect(code).toBe('202412140001'); // Sequence should increment by 1
    });

    test('should handle invalid ticketedCode format gracefully', async () => {
        // Mock a report with an invalid ticketedCode format
        Report.findOne.mockResolvedValue({ ticketedCode: '20241211INVALID' });

        const code = await generateTicketedCode();

        expect(code).toBe('202412140001'); // Sequence should reset to 1
    });
});
