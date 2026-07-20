import { mount } from 'svelte'
import Sidepanel from './Sidepanel.svelte'
import './style.css'

const app = mount(Sidepanel, {
  target: document.getElementById('app')!,
})

export default app
