export function getAllFiles(projects) {
  const allFiles = [];

  projects.forEach(project => {
    project.files?.forEach(file => {
      allFiles.push({
        ...file,
        projectId: project.id,
        folderId: null
      });
    });

    project.folders?.forEach(folder => {
      folder.files?.forEach(file => {
        allFiles.push({
          ...file,
          projectId: project.id,
          folderId: folder.id
        });
      });
    });
  });

  return allFiles;
}

export function getFilesFromProject(projects, projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];

  const files = [];

  project.files?.forEach(file => {
    files.push({
      ...file,
      projectId: project.id,
      folderId: null
    });
  });

  project.folders?.forEach(folder => {
    folder.files?.forEach(file => {
      files.push({
        ...file,
        projectId: project.id,
        folderId: folder.id
      });
    });
  });

  return files;
}


export function  getActiveFile(projects, activeTab)  {
      return getAllFiles(projects).find(f => f.id === activeTab) || getAllFiles(projects)[0];
    };
