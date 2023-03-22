// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
const Mautic = require('mautic')

export default async function handler(req, res) {

  try {
    const event_id = '590727360437';

    const client = new Mautic({
        baseUrl: 'https://mautic.educlaas.com/api',
        auth: {
            username: 'educlaas',
            password: 'educlaas*2@3$1#'
        }
    })

    const response = await axios.get(`https://www.eventbriteapi.com/v3/events/${event_id}/attendees/`, {
      headers: {
        Authorization: 'Bearer PGQK7SWL3AA3FAXHXLV7',
      },
    });
    const data = response.data;
    const sortedAttendees = data.attendees.sort((a, b) => new Date(b.changed) - new Date(a.changed));
    const latestAttendee = sortedAttendees[0];
    
    const response2 = await client.contacts.create({
        firstname: latestAttendee.profile.first_name,
        lastname: latestAttendee.profile.last_name,
        email: latestAttendee.profile.email,        
    })

   
    const segment = await client.segments.addContact(216, response2.data.contact.id) // segmentId, contactId



    res.status(200).json(latestAttendee);

  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching registration data' });
  }
}
