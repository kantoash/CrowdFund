import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CreateBtn from "./components/CreateBtn";
import Hero from "./components/Hero";
import ProjectsCard from "./components/ProjectsCard";

function Home({ contract }) {
  const [owner, setOwner] = useState(null);
  const [projectTax, setProjectTax] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ContractLoader = async () => {
      const Owner = await contract.owner();
      setOwner(Owner);
      const ProjectTax = await contract.projectTax();
      setProjectTax(ethers.utils.formatEther(ProjectTax));
      const Balance = await contract.balance();
      setBalance(ethers.utils.formatEther(Balance));
    };
    ContractLoader();
  }, [contract]);
  
  useEffect(() => {
    // projectsOf
    const MyProjectLoader = async () => {
      let ProjectCount = await contract.ProjectCount();
      let projects = [];
      for (let index = 1; index <= ProjectCount; index++) {
        let Project = await contract.projects(index);
        let item = {
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
        projects.push(item);
      }
      setProjects(projects);
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
    <div className="flex flex-col justify-center items-center max-w-7xl mx-auto space-y-14 mb-16" >
      <Hero />
  <div className="flex flex-row items-center justify-center space-x-5  ">
  <div onClick={() => navigate('/My-project')} className=" p-5 rounded-full bg-blue-500 text-xl uppercase font-semibold text-white active:scale-105 transition-transform duration-200  cursor-pointer ">My-Projects</div>
  <CreateBtn contract={contract} />
  </div>
      <div className="text-center flex flex-col font-[500] text-xl ">
        <h3 className="text-2xl ">
          Owner: <span className="text-base">{owner}</span>{" "}
        </h3>
        <h3>Create Fee {projectTax} ETH </h3>
      </div>
      <div className=" mt-10 m-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10  ">
        {projects.map((project, id) => (
          <ProjectsCard project={project} key={id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
