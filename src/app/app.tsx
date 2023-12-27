import Content from "components/organisms/content";
import Header from "components/organisms/header";
import Sidebar from "components/organisms/sidebar";

function App() {
  return (
    <div>
      <Header />
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Sidebar />
          <Content />
        </div>
      </div>
    </div>
  );
}

export default App;
