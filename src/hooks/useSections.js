import { useCallback, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../providers";
import {
  addSection,
  getSections,
  removeSection,
  updateSection,
} from "../services";

export default function useSections() {
  const { user } = useContext(UserContext);
  const [sections, setSections] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    const newSections = await getSections(user?.email);
    const sortedSections = newSections.sort(
      (b1, b2) => b2.dateCreated - b1.dateCreated
    );
    setSections(sortedSections);
    setLoading(false);
  }, [user.email, setSections]);

  useEffect(() => getData(), [getData, shouldRefresh]);

  const refresh = useCallback(() => setShouldRefresh((prev) => !prev), []);

  const add = useCallback(
    async (section) => {
      const newSections = [...sections];

      section.id = uuidv4();
      section.dateCreated = Date.now();
      newSections.push(section);

      setSections(newSections);
      await addSection(user.email, section);
    },
    [sections, setSections, user.email]
  );

  const remove = useCallback(
    async (sectionId) => {
      const newSections = [...sections].filter((x) => x.id !== sectionId);
      setSections(newSections);
      await removeSection(user.email, sectionId);
    },
    [sections, setSections, user.email]
  );

  const update = useCallback(
    async (section) => {
      const newSections = [...sections].filter((x) => x.id !== section.id);
      newSections.push(section);
      setSections(newSections);
      await updateSection(user.email, section);
    },
    [sections, setSections, user.email]
  );

  return {
    isLoading,
    sections,
    refresh,
    add,
    remove,
    update,
  };
}
