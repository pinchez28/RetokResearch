import Client from '../../models/client/Client.js';
import '../../models/client/Project.js';
import User from '../../models/auth/User.js';

// GET all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('projects').lean(); // lean gives plain JS objects

    // Populate email from User
    const clientsWithEmail = await Promise.all(
      clients.map(async (client) => {
        const user = await User.findOne({
          profile: client._id,
          role: 'Client',
        });
        return { ...client, email: user?.email || 'N/A' };
      })
    );

    res.status(200).json(clientsWithEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
};

// GET single client by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('projects');
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch client' });
  }
};

// UPDATE client
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update client' });
  }
};

// DELETE client
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete client' });
  }
};
