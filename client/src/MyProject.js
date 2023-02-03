import React, { useState, useEffect } from "react";
import ProjectsCard from "./components/ProjectsCard";
import { useGlobalState } from "./utils";

function MyProject({ contract }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MyProjectLoader = async () => {
      let Projects = await contract.getProjectOf();
      const allProjects = await Promise.all(
        Projects.map(async (Project) => {
          let item = {};
          item = {
            id: Project.id,
            owner: Project.owner,
            title: Project.title,
            description: Project.description,
            imageURL: Project.imageURL,
            cost: Project.cost,
            raised: Project.raised,
            timestamp: Project.timestamp,
            expiresAt: Project.expiresAt,
            minBid: Project.minBid,
            fundersCount: Project.fundersCount,
            status: Project.status,
          };
          return item;
        })
      );
      setMyProjects(allProjects);
      setLoading(false);
    };
    MyProjectLoader();
  }, [contract]);


  if (loading) {
    return (
      <>
        <div className="uppercase text-4xl text-blue-500 animate-pulse text-center pt-10">
          loading...
        </div>
      </>
    );
  }

  return (
    <div className=" mt-10 m-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-4xl  lg:max-w-6xl  mx-auto ">
      {myProjects.map((project, id) => (
        <ProjectsCard project={project} key={id} />
      ))}
    </div>
  );
}

export default MyProject;
