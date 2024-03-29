import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { NetworkStateContext, UserContext } from "../providers";
import {
  addSection,
  getSections,
  removeSection,
  updateSection,
} from "../services";
import logf from "../services/log";

export const SectionsContext = createContext({
  isLoading: false,
  sections: [],
  refetch: () => {},
  add: (_) => {},
  remove: (_) => {},
  update: (_) => {},
});

export function SectionsProvider({ children }) {
  const { user } = useContext(UserContext);
  const { isOffline, setOnOnline } = useContext(NetworkStateContext);
  const [sections, setSections] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [toggleRefetch, setToggleRefetch] = useState(false);

  const getData = useCallback(async () => {
    if (!user?.email || isOffline) {
      return;
    }
    
    setLoading(true);
    
    try {
      const newSections = await getSections(user.email);
      const sortedSections = newSections.sort(
        (b1, b2) => b2.dateCreated - b1.dateCreated
      );
      setSections(sortedSections);
    } catch (error) {
      logf(user.email, "getData", error);
      alert("Error getting data");
    } finally {
      setLoading(false);
    }
  }, [user?.email, isOffline, setSections]);

  useEffect(() => getData(), [getData, toggleRefetch]);

  const refetch = useCallback(() => setToggleRefetch((prev) => !prev), []);

  useEffect(
    () => setOnOnline(refetch),
    // eslint-disable-next-line
    []
  );

  const add = useCallback(
    async (section) => {
      if (isOffline) {
        return;
      }

      if (!user?.email) {
        logf(
          user?.email,
          "add > user?.email check",
          "Unexpected state: user?.email is null"
        );
        return;
      }

      setLoading(true);
      const newSections = [...sections];

      section.id = uuidv4();
      section.dateCreated = Date.now();
      newSections.push(section);

      try {
        await addSection(user.email, section);
        setSections(newSections);
      } catch (err) {
        logf(user.email, "add (section)", err);
        alert("Error adding section");
      } finally {
        setLoading(false);
      }
    },
    [isOffline, sections, user?.email, setSections]
  );

  const remove = useCallback(
    async (sectionId) => {
      if (isOffline) {
        return;
      }

      if (!user?.email) {
        logf(
          user?.email,
          "remove > user?.email check",
          "Unexpected state: user?.email is null"
        );
        return;
      }

      setLoading(true);
      try {
        const newSections = [...sections].filter((x) => x.id !== sectionId);
        await removeSection(user.email, sectionId);
        setSections(newSections);
      } catch (err) {
        logf(user.email, "remove (section)", err);
        alert("Error removing section");
      } finally {
        setLoading(false);
      }
    },
    [isOffline, sections, user?.email, setSections]
  );

  const update = useCallback(
    async (section) => {
      if (isOffline) {
        return;
      }

      if (!user?.email) {
        logf(
          user?.email,
          "update > user?.email check",
          "Unexpected state: user?.email is null"
        );
        return;
      }

      setLoading(true);
      try {
        const newSections = [...sections].filter((x) => x.id !== section.id);
        newSections.push(section);
        await updateSection(user.email, section);
        setSections(newSections);
      } catch (err) {
        logf(user.email, "update (section)", err);
        alert("Error updating section");
      } finally {
        setLoading(false);
      }
    },
    [isOffline, sections, user?.email, setSections]
  );

  return (
    <SectionsContext.Provider
      value={{
        isLoading,
        sections,
        refetch,
        add,
        remove,
        update,
      }}
    >
      {children}
    </SectionsContext.Provider>
  );
}
