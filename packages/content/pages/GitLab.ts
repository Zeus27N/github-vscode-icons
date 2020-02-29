import { getIconUrl } from '../utils/Icons';
import { isGitLabRepo } from '../utils/PageDetect';
import { mutate } from 'fastdom';
import { getFolderIcon, getFileIcon } from '../utils/Dev';

const QUERY_TREE_ITEMS = '.tree-item';

export class Gitlab {
  constructor() {
    this.update();
  }

  update(e?: any) {
    if (isGitLabRepo()) {
      this.showRepoTreeIcons();
    }
  }

  showRepoTreeIcons() {
    const treeItems = document.querySelectorAll(QUERY_TREE_ITEMS);
    for (let i = 0; i < treeItems.length; i++) {
      /**
       * [TR:
       *  [TD: [[I: icon], [A: [SPAN: name]]]],
       *  [TD: [SPAN: [A: message]]],
       *  [TD: [TIME: ago]]
       * ]
       */
      const itemEl = treeItems[i];
      const newIconEl = document.createElement('img');

      const iconAndNameEls = itemEl.firstElementChild!;
      const iconEl = iconAndNameEls.firstElementChild!;
      const nameEl = iconAndNameEls.lastElementChild as HTMLAnchorElement;

      const name = nameEl.innerText.toLowerCase();
      if (i === 0 && name === '..') {
        continue;
      }
      const iconPath = nameEl.href.indexOf('/tree/') > 0 ? getFolderIcon(name) : getFileIcon(name);

      mutate(() => {
        newIconEl.setAttribute('src', getIconUrl(iconPath));
        newIconEl.setAttribute('class', 'vscode-icon');
        iconAndNameEls.replaceChild(newIconEl, iconEl);
      });
    }
  }

}
