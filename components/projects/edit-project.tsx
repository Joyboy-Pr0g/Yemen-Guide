'use client'

import { ProjectFormModal, type ProjectModalProps } from './create-project'

type EditProjectModalProps = Omit<ProjectModalProps, 'mode' | 'isAdmin' | 'open'> & {
    open: boolean
    project: NonNullable<ProjectModalProps['project']>
}

export function EditProjectModal({ project, ...props }: EditProjectModalProps) {
    return <ProjectFormModal {...props} mode="edit" isAdmin={false} project={project} />
}
