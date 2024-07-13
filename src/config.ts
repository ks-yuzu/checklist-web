import axios from 'axios'
import yaml from 'js-yaml'


interface NavItem {
  type?:     'dropdown'
  text:      string
  url:       string
  dropdown:  NavSubItem[]
}

interface NavSubItem {
  type?:     'header' | 'divider'
  text:      string
  url:       string
}

interface Checklist {
  title:      string
  baseTime?:  string             // XX:XX
  checklist:  ChecklistTask[]
  active?:    boolean
}

export interface ChecklistTask {
  time:       string
  timeOffset: number
  summary:    string
  details:    string
}

export interface Timer {
  enabled: boolean
  minutes: number
  sound: {
    enabled?: boolean
    url?: string
  }
  notification: {
    enabled?: boolean
  }
}

export class Config {
  public title:      string
  public nav:        NavItem[]
  public checklists: Checklist[]
  public highlight: {
    [key: string]: {
      lefttime?:   number
      color?:      string
      background?: string
    }
  }
  public timer: Timer

  public async load(configUrl: string) {
    const {data} = await axios.get(configUrl)
    const config = yaml.load(data) as any

    this.title      = config.title
    this.nav        = config.nav
    this.checklists = config.checklists
    this.highlight  = config.highlight
    this.timer      = config.timer

    console.log({conf:this})
  }
}

const config = new Config()
export default config
