import { Box, styled, useScrollTrigger } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSections } from "../../hooks";
import { NetworkStateContext } from "../../providers";
import Block from "../Block";
import Loading from "../Loading";
import Note from "../Note";
import { useRemoveSectionModal } from "./hooks";
import useFAB from "./useFAB";

export default function Dashboard() {
  const { isOffline } = useContext(NetworkStateContext);
  const [contentRef, setContentRef] = useState();
  const { isLoading, sections, add, remove, update, refresh } = useSections();
  const trigger = useScrollTrigger({
    target: contentRef ? contentRef : window,
  });

  useEffect(() => {
    if (!isLoading && !sections.length && !isOffline) {
      refresh();
    }
    // eslint-disable-next-line
  }, [isOffline]);

  const handleAddSection = useCallback(
    (section) => {
      add(section);
      contentRef?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [add, contentRef]
  );
  const sortedSections = useMemo(
    () => [...sections].sort((s1, s2) => s2.dateCreated - s1.dateCreated),
    [sections]
  );

  const shouldDisplayFab = useMemo(
    () => !isLoading && !trigger,
    [isLoading, trigger]
  );

  const fabComponent = useFAB(
    sortedSections,
    shouldDisplayFab,
    handleAddSection
  );

  const { open: openRemoveSection } = useRemoveSectionModal(remove);

  const sectionComponents = useMemo(
    () =>
      sortedSections.map((section) =>
        section.type === "block" ? (
          <Block
            key={section.id}
            section={section}
            onUpdate={(updatedSection) => update(updatedSection)}
            deleteBlock={openRemoveSection}
          />
        ) : (
          <Note
            key={section.id}
            data={section}
            deleteNote={openRemoveSection}
          />
        )
      ),
    [sortedSections, update, openRemoveSection]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content ref={(_ref) => setContentRef(_ref)}>
        {!sectionComponents?.length ? (
          <EmptySectionsMessage />
        ) : (
          sectionComponents
        )}
        <Footer>&copy;Copyright 2022 by misicnenad</Footer>
      </Content>
      {fabComponent}
    </Container>
  );
}

function EmptySectionsMessage() {
  return (
    <div
      style={{
        marginTop: "auto",
        color: "lightgray",
      }}
    >
      Add your first block/note
    </div>
  );
}

const Container = styled(Box)`
  height: 100vh;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  position: relative;
`;

const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Footer = styled("footer")`
  font-size: 12px;
  width: 100%;
  margin-top: auto;
  text-align: center;
`;
