import { DOCUMENT, Location } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { EventManager } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { KeyboardShortcutsComponent } from '../keyboard-shortcuts/keyboard-shortcuts.component'

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

  shortcutsDisplay: Map<string, string> = new Map<string, string>([
    ['Control + /', 'Show Keyboard Shortcuts'],
    ['Control + Left Arrow', 'Go Back'],
    ['Control + Right Arrow', 'Go Forward']
  ])

  shortcutsDialog: MatDialogRef<KeyboardShortcutsComponent, any> | null = null

  constructor(private eventManager: EventManager, private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document, private location: Location) {
    this.addShortcut({ keys: 'shift.?' }).subscribe(() => {
      this.showShortcuts()
    })
    this.addShortcut({ keys: 'Shift.arrowleft' }).subscribe((res) => {
      this.back()
    })
    this.addShortcut({ keys: 'Shift.arrowright' }).subscribe((res) => {
      this.forward()
    })
  }

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

  showShortcuts() {
    if (!this.shortcutsDialog) {
      this.shortcutsDialog = this.dialog.open(KeyboardShortcutsComponent, {
        data: this.shortcutsDisplay
      })
    } else {
      this.shortcutsDialog.close()
      this.shortcutsDialog = null
    }
  }

  back() {
    this.location.back()
  }

  forward() {
    this.location.forward()
  }
}
