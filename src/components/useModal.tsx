import { Teleport } from 'vue'
import type { Component, VNode } from 'vue'

export function useModal() {
  const dialogVNode = ref()

  const modalRef = ref<HTMLDialogElement>()
  const modalCtx = defineComponent(() => {
    return () => (
      <Teleport to="body">
        <dialog ref={modalRef} class="modal">
          <div class="modal-box">
            <form method="dialog">
              <button class="absolute right-2 top-2 btn btn-circle btn-ghost btn-sm">
                ✕
              </button>
            </form>
            {dialogVNode.value && <dialogVNode.value />}
          </div>

          <form method="dialog" class="modal-backdrop">
            <button>关闭</button>
          </form>
        </dialog>
      </Teleport>
    )
  })

  function modal(vnode: VNode | Component) {
    dialogVNode.value = vnode
    modalRef.value?.showModal()
  }

  return { modal, modalCtx }
}
