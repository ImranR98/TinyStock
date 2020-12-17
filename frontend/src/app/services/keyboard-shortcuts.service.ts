import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { EventManager } from '@angular/platform-browser'
import { Observable } from 'rxjs'

type Options = {
  element: any
  keys: string
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  defaults: Partial<Options> = {
    element: this.document
  }

  constructor(private eventManager: EventManager, @Inject(DOCUMENT) private document: Document) { }

  addShortcut(options: Partial<Options>): Observable<Event> {
    const merged = { ...this.defaults, ...options }
    const event = `keydown.${merged.keys}`

    return new Observable(observer => {
      const handler = (e) => {
        e.preventDefault()
        observer.next(e)
      }

      const dispose = this.eventManager.addGlobalEventListener(
        'document', event, handler
      )

      return () => {
        dispose()
      }
    })
  }
}
