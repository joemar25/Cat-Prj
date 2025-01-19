import { Notification, NotificationStats } from "@/lib/types/notification"

export const notificationStats: NotificationStats = {
  all: 20,
  archive: 10,
  favorite: 17,
  unread: 3
}

export const notifications: Notification[] = [
  {
    id: '1',
    message: "We're pleased to inform you that a new customer has registered! Please follow up promptly by contacting.",
    timestamp: 'Just Now',
    isRead: false,
    type: 'customer',
    email: {
      subject: 'New Customer Registration',
      body: 'Dear Sales Team,\n\nWe are excited to inform you that a new customer has just registered on our platform. This presents an excellent opportunity for us to make a great first impression and potentially secure a long-term client.\n\nCustomer Details:\nName: John Doe\nEmail: john.doe@example.com\nRegistration Date: [Current Date]\n\nPlease reach out to the customer within the next 24 hours to:\n1. Welcome them to our platform\n2. Offer assistance with any questions they might have\n3. Provide an overview of our products/services that might be relevant to their needs\n\nRemember, prompt and friendly follow-up can significantly increase customer engagement and satisfaction.\n\nBest regards,\nCustomer Support Team',
      from: 'support@ourcompany.com'
    }
  },
  {
    id: '2',
    message: 'Hello Sales Marketing Team,We have a special offer for our customers! Enjoy a 20% discount on selected..',
    timestamp: '30 mins ago',
    isRead: false,
    type: 'sales',
    email: {
      subject: 'New Special Offer: 20% Discount',
      body: 'Dear Sales Marketing Team,\n\nWe are excited to announce a new special offer for our valued customers! We are offering a 20% discount on selected products for a limited time.\n\nOffer Details:\n- 20% discount on selected items\n- Valid from [Start Date] to [End Date]\n- Applicable to both new and existing customers\n\nPlease ensure that all team members are aware of this promotion and are ready to assist customers who inquire about it. This is a great opportunity to boost sales and customer satisfaction.\n\nIf you have any questions about the promotion or need any additional materials, please don\'t hesitate to reach out.\n\nLet\'s make this promotion a success!\n\nBest regards,\nMarketing Department',
      from: 'marketing@ourcompany.com'
    }
  },
  {
    id: '3',
    message: "Hello Sales Marketing Team, This is a reminder to achieve this month's sales target. Currently, we've...",
    timestamp: '2 days ago',
    isRead: false,
    type: 'sales',
    email: {
      subject: "Monthly Sales Target Reminder",
      body: "Dear Sales Marketing Team,\n\nI hope this email finds you well. As we approach the end of the month, I wanted to send a friendly reminder about our monthly sales target.\n\nCurrent Status:\n- Month-to-date sales: $X,XXX,XXX\n- Monthly target: $X,XXX,XXX\n- Remaining to achieve target: $XXX,XXX\n\nWe're currently at XX% of our goal, which is a great effort, but we still have some way to go. Here are some suggestions to help us reach our target:\n\n1. Follow up with potential clients who have shown interest but haven't made a purchase yet.\n2. Reach out to existing customers about our new products or services that complement their previous purchases.\n3. Utilize our current promotional offers in your pitches.\n\nRemember, every sale counts, no matter how small. Let's work together to finish the month strong!\n\nIf you need any support or have any questions, please don't hesitate to reach out to me or your team lead.\n\nBest regards,\nSales Manager",
      from: "sales.manager@ourcompany.com"
    }
  },
  // Add more notifications as needed...
]

