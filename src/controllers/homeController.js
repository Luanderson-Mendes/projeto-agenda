const Contato = require('../models/contatoModel')

exports.index = async (req, res) => {
    const contatos = await Contato.getContacts()
    res.render('index', { contatos })
}