import SphereWithIcons from "@/components/3D/IconSphere";
import BackgroundWithDynamicCircles from "@/components/Wrappers/Client/RepeatedBg";

export default function Home() {
  return (
    <div>
      {/* <div>Home page</div> */}
      <BackgroundWithDynamicCircles>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-y-5 items-center">
            <h1 className="text-3xl">Code Execution Platform</h1>
            <p className="w-3/4 text-center leading-8 tracking-widest font-light">
              A platform tailored for people to ADD Problems, solve em and
              possibly get hired by practice! We are building the features for
              conducting contests too soon!
            </p>
          </div>
        </div>
      </BackgroundWithDynamicCircles>
    </div>
  );
}
