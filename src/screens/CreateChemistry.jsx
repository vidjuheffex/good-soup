import Input from '../components/Input'
import { createPortal } from 'react-dom'
import { redirect, Form, useNavigate } from 'react-router-dom'

import "./CreateChemistry.css"
import Modal from '../components/Modal'

export default () => {
    const navigate = useNavigate()
    return <Modal handleClose={()=>navigate('/')}>
    <Form method='post'>
        <h1>Create New Chemistry Recipe</h1>
        <Input name="name" label="Name" placeholder="eg. Rodinal 1:50" required />
        <Input name="ratio" label="Chem Ratio" placeholder="eg. 1:50" required/>
        <Input name="temp" label="Temp" placeholder="eg. 68F" required />
        <Input name="notes" label="Notes" type="textarea" placeholder="eg. One-shot but can be used up to 8x with increased 10% dev times." />
        <button type="submit">Submit</button>
    </Form>
    </Modal>}